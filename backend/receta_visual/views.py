from rest_framework import viewsets, permissions
from .models import RecetaVisual
from .serializers import RecetaVisualSerializer
from enum import Enum
from authapp.permissions import HasRole

# # Enum class de ejemplo
# class Accion(Enum):
#     CREAR = "crear"
#     ACTUALIZAR = "actualizar"
#     BORRAR = "borrar"

#     def __str__(self):
#         return self.value
    

# Create your views here.
class RecetaVisualViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    required_roles = ["Admin","optometrista"]
    queryset = RecetaVisual.objects.all()
    serializer_class = RecetaVisualSerializer
    

    # Ver como declarar estos metodos para ser llamados en la URL de la API
    def create(self, request, *args, **kwargs):
        """
        Crea una nueva RecetaVisual a partir de los datos enviados en POST.
        """

        # 1️⃣ Tomamos los datos del request y los pasamos al serializer
        serializer = self.get_serializer(data=request.data)
        # self.get_serializer() es un método de ModelViewSet que devuelve
        # una instancia de tu serializer configurada correctamente.
        # data=request.data pasa los datos que el cliente envió en POST.

        # 2️⃣ Validamos los datos
        if serializer.is_valid():
            # is_valid() revisa que los datos cumplan con los requisitos del serializer
            # (tipos de campo, longitud, relaciones, campos obligatorios, etc.)

            # 3️⃣ Guardamos la instancia en la base de datos
            instance = serializer.save()
            # save() crea el objeto RecetaVisual y lo persiste en la base de datos.

            # 4️⃣ Puedes agregar lógica extra aquí, por ejemplo auditoría
            # Ejemplo:
            print(f"Se creó la receta con id {instance.id}")

            # 5️⃣ Retornamos la respuesta al cliente con los datos del objeto creado
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            # Response es de rest_framework.response
            # status.HTTP_201_CREATED indica que se creó un recurso nuevo

        # 6️⃣ Si los datos no son válidos, devolvemos los errores
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # serializer.errors contiene un diccionario con los errores de validación

    def update():
        pass

    def select_by_id():
        pass

    def select_by_name():
        pass

    # Ver como preparar la auditoria para cada una de las acciones